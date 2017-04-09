require 'asciidoctor/extensions' unless RUBY_ENGINE == 'opal'
require 'pp'

Asciidoctor::Extensions.register do
  preprocessor do
    process do |doc, reader|
      doc.instance_variable_set :@sourcemap, true
      nil
    end
  end
end

Asciidoctor::Extensions.register do
  treeprocessor do
    process do |doc|

      if (doc.attr? :scriptdoc)

        notesFile = ::File.open doc.attr :scriptdoc
        notes = Asciidoctor.load notesFile

        doc.blocks.replace (doc.find_by role: 'SLIDE').map {|slide|

          slideLineno = slide.source_location.lineno - 1

          slide.parent.blocks.delete slide
          sect = Asciidoctor::Section.new doc, 1, false
          sect.title = '!'
          # trick for bespoke converter
          sect.set_attr 'id', (sect.id = slide.id)
          slide.id = nil
          if slide.attr? 'transform'
            sect.set_attr 'transform', (slide.attr 'transform')
          end
          slide.roles.each {|r|
            sect.add_role r if r.start_with? 'tpl-'
          }
          if slide.blocks?
            slide.blocks.each do |child|
              child.parent = sect
              sect << child
            end
          else
            slide.roles.each {|r|
              slide.remove_role r if r.start_with? 'tpl-'
              slide.remove_role r if r == 'SLIDE'
            }
            slide.parent = sect
            sect << slide
          end

          # puts '-->', sect.id
          # puts notes.find_by id: sect.id

          n = (notes.find_by id: sect.id)[0]
          if n != nil
            if n.parent != nil
              notesLineno = n.source_location.lineno - 1
              n.parent.blocks.delete n
              n.id = nil
              n.add_role 'cue'
              sect << n
            end
          end

          sect.set_attr 'data', {
            :slideLineno => slideLineno,
            :notesLineno => notesLineno
          }

          sect
        }
      end

      nil
    end
  end
end
